import axios from 'axios';

export default async function handler(req, res) {
  const { page } = req.query; // Extract any query parameters you need
  const apiUrl = `http://api.baserow.io/api/database/rows/table/212626/?page=${page}&user_field_names=true`;

  try {
    const apiResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: `Token HbYQMdxStJRoUvVLyjjegU0s86MIQY9F`, // Your API token
      },
    });

    res.status(200).json(apiResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
