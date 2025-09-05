import { google } from 'googleapis';

// Use environment variables for authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1PoNYC6E2gaebProqvGsz7_hX7dAlld4Mh_YoCyomD48';
const range = 'Web-08-2025!A1:K';

const getGoogleSheetsInstance = async () => {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
};

/**
 * Controller function to fetch all data from a Google Sheet.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getAllData = async (req, res) => {
  try {
    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row =>
      Object.fromEntries(headers.map((header, i) => [header, row[i] || null]))
    );

    res.json(data);
  } catch (error) {
    console.error('Error fetching all data from Google Sheets API:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch unique provinces from a Google Sheet.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getUniqueProvinces = async (req, res) => {
  try {
    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const provinceIndex = headers.findIndex(header => header.trim() === 'Province');

    if (provinceIndex === -1) {
      return res.status(404).json({ error: 'Province column not found.' });
    }

    const uniqueProvinces = new Set();
    for (let i = 1; i < rows.length; i++) {
      const province = rows[i][provinceIndex];
      if (province) {
        uniqueProvinces.add(province.trim());
      }
    }

    res.json([...uniqueProvinces]);
  } catch (error) {
    console.error('Error fetching unique provinces:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch unique districts from a Google Sheet.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getUniqueDistricts = async (req, res) => {
  try {
    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const districtIndex = headers.findIndex(header => header.trim() === 'District');

    if (districtIndex === -1) {
      return res.status(404).json({ error: 'District column not found.' });
    }

    const uniqueDistricts = new Set();
    for (let i = 1; i < rows.length; i++) {
      const district = rows[i][districtIndex];
      if (district) {
        uniqueDistricts.add(district.trim());
      }
    }

    res.json([...uniqueDistricts]);
  } catch (error) {
    console.error('Error fetching unique districts:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch unique schools from a Google Sheet.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getUniqueSchools = async (req, res) => {
  try {
    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const schoolIndex = headers.findIndex(header => header.trim() === 'School');

    if (schoolIndex === -1) {
      return res.status(404).json({ error: 'School column not found.' });
    }

    const uniqueSchools = new Set();
    for (let i = 1; i < rows.length; i++) {
      const school = rows[i][schoolIndex];
      if (school) {
        uniqueSchools.add(school.trim());
      }
    }

    res.json([...uniqueSchools]);
  } catch (error) {
    console.error('Error fetching unique schools:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch unique districts based on a selected province.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getDistrictsByProvince = async (req, res) => {
  try {
    const { province } = req.params;
    if (!province) {
      return res.status(400).json({ error: 'Province parameter is required.' });
    }

    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const provinceIndex = headers.findIndex(header => header.trim() === 'Province');
    const districtIndex = headers.findIndex(header => header.trim() === 'District');

    if (provinceIndex === -1 || districtIndex === -1) {
      return res.status(404).json({ error: 'Province or District column not found.' });
    }

    const uniqueDistricts = new Set();
    for (let i = 1; i < rows.length; i++) {
      const rowProvince = rows[i][provinceIndex];
      const rowDistrict = rows[i][districtIndex];
      if (rowProvince && rowDistrict && rowProvince.trim() === province.trim()) {
        uniqueDistricts.add(rowDistrict.trim());
      }
    }

    res.json([...uniqueDistricts]);
  } catch (error) {
    console.error('Error fetching unique districts by province:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch unique schools based on a selected district.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getSchoolsByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    if (!district) {
      return res.status(400).json({ error: 'District parameter is required.' });
    }

    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const districtIndex = headers.findIndex(header => header.trim() === 'District');
    const schoolIndex = headers.findIndex(header => header.trim() === 'School');

    if (districtIndex === -1 || schoolIndex === -1) {
      return res.status(404).json({ error: 'District or School column not found.' });
    }

    const uniqueSchools = new Set();
    for (let i = 1; i < rows.length; i++) {
      const rowDistrict = rows[i][districtIndex];
      const rowSchool = rows[i][schoolIndex];
      if (rowDistrict && rowSchool && rowDistrict.trim() === district.trim()) {
        uniqueSchools.add(rowSchool.trim());
      }
    }

    res.json([...uniqueSchools]);
  } catch (error) {
    console.error('Error fetching unique schools by district:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch all data based on a selected province.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getByProvinces = async (req, res) => {
  try {
    const { province } = req.params;
    if (!province) {
      return res.status(400).json({ error: 'Province parameter is required.' });
    }

    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const provinceIndex = headers.findIndex(header => header.trim() === 'Province');

    if (provinceIndex === -1) {
      return res.status(404).json({ error: 'Province column not found.' });
    }

    const filteredData = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowProvince = row[provinceIndex];
      if (rowProvince && rowProvince.trim() === province.trim()) {
        const rowObject = Object.fromEntries(headers.map((header, j) => [header, row[j] || null]));
        filteredData.push(rowObject);
      }
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching data by province:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch all data based on a selected district.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getByDistricts = async (req, res) => {
  try {
    const { district } = req.params;
    if (!district) {
      return res.status(400).json({ error: 'District parameter is required.' });
    }

    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const districtIndex = headers.findIndex(header => header.trim() === 'District');

    if (districtIndex === -1) {
      return res.status(404).json({ error: 'District column not found.' });
    }

    const filteredData = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowDistrict = row[districtIndex];
      if (rowDistrict && rowDistrict.trim() === district.trim()) {
        const rowObject = Object.fromEntries(headers.map((header, j) => [header, row[j] || null]));
        filteredData.push(rowObject);
      }
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching data by district:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Controller function to fetch all data based on a selected school.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const getBySchools = async (req, res) => {
  try {
    const { school } = req.params;
    if (!school) {
      return res.status(400).json({ error: 'School parameter is required.' });
    }

    const googleSheets = await getGoogleSheetsInstance();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      return res.json([]);
    }

    const headers = rows[0];
    const schoolIndex = headers.findIndex(header => header.trim() === 'School');

    if (schoolIndex === -1) {
      return res.status(404).json({ error: 'School column not found.' });
    }

    const filteredData = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowSchool = row[schoolIndex];
      if (rowSchool && rowSchool.trim() === school.trim()) {
        const rowObject = Object.fromEntries(headers.map((header, j) => [header, row[j] || null]));
        filteredData.push(rowObject);
      }
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching data by school:', error);
    res.status(500).send('Internal Server Error');
  }
};