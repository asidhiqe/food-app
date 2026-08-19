import * as XLSX from 'xlsx';

export const ExcelService = {
  // Parse CSV or Excel file to student list
  async parseStudentFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!jsonRows || jsonRows.length === 0) {
            throw new Error('The uploaded file is empty.');
          }

          // Normalize column headers
          const normalizedStudents = jsonRows.map((row, idx) => {
            const keys = Object.keys(row);
            const findVal = (possibleKeys) => {
              for (const pk of possibleKeys) {
                const matchedKey = keys.find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === pk.toLowerCase().replace(/[^a-z0-9]/g, ''));
                if (matchedKey && row[matchedKey] !== '') return String(row[matchedKey]).trim();
              }
              return '';
            };

            const id = findVal(['studentid', 'id', 'admissionno', 'student_id', 'rollno']) || `STU-${idx + 1001}`;
            const studentName = findVal(['studentname', 'name', 'fullname', 'student_name']) || 'Unknown Student';
            const studentClass = findVal(['class', 'grade', 'standard']) || 'Grade 1';
            const section = findVal(['section', 'sec', 'division']) || 'A';
            const parentPhone = findVal(['parentphone', 'phone', 'contact', 'mobile', 'parentcontact', 'parent_phone']) || '';
            const parentName = findVal(['parentname', 'parent_name', 'fathername', 'mothername', 'guardian']) || '';

            return {
              id,
              studentName,
              class: studentClass,
              section,
              parentPhone,
              parentName
            };
          });

          resolve(normalizedStudents);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  },

  // Export Daily Orders to Excel
  exportOrdersToExcel(orders, schoolName, filterDate) {
    const formattedData = orders.map((ord) => ({
      'Order No': ord.orderNumber,
      'Token #': ord.tokenNumber,
      'Date': ord.requiredDate,
      'Meal Slot': ord.mealPeriodName,
      'Student ID': ord.studentId,
      'Student Name': ord.studentName,
      'Class & Section': ord.classSection,
      'Parent Contact': ord.parentPhone,
      'Items Ordered': ord.items.map((i) => `${i.quantity}x ${i.name}`).join(' | '),
      'Total Amount': ord.totalAmount,
      'Payment Status': ord.paymentStatus,
      'Delivery Status': ord.deliveryStatus,
      'Delivered At': ord.deliveredAt ? new Date(ord.deliveredAt).toLocaleTimeString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Orders');

    const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Orders_${filterDate || 'All'}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  // Download Sample Student CSV Template
  downloadSampleTemplate() {
    const sampleData = [
      {
        'Student ID': 'BW-101',
        'Student Name': 'Aarav Sharma',
        'Class': 'Grade 4',
        'Section': 'A',
        'Parent Phone': '+91 98765 43210',
        'Parent Name': 'Rohit Sharma'
      },
      {
        'Student ID': 'BW-102',
        'Student Name': 'Ananya Patel',
        'Class': 'Grade 4',
        'Section': 'B',
        'Parent Phone': '+91 98765 43211',
        'Parent Name': 'Pooja Patel'
      },
      {
        'Student ID': 'BW-103',
        'Student Name': 'Rohan Gupta',
        'Class': 'Grade 5',
        'Section': 'A',
        'Parent Phone': '+91 98765 43212',
        'Parent Name': 'Amit Gupta'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students_Template');
    XLSX.writeFile(workbook, 'Brainwaves_Student_Roster_Template.xlsx');
  }
};
