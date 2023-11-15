import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const baserowResponse = await axios.get(
        'https://api.baserow.io/api/database/rows/table/212626/?user_field_names=true',
        {
          headers: {
            'Authorization': `Token HbYQMdxStJRoUvVLyjjegU0s86MIQY9F`
          }
        }
      );

      // Check if the fetch was successful
      if (baserowResponse.status === 200) {
        res.status(200).json({ message: 'Records fetched successfully', data: baserowResponse.data });
      } else {
        res.status(baserowResponse.status).json({
          error: 'Failed to fetch records',
          details: JSON.stringify(baserowResponse.data)
        });
      }
    } catch (error) {
      console.error('Error in GET request:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.response ? JSON.stringify(error.response.data) : 'No response data'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
