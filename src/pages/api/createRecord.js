import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const requestBody = JSON.stringify(req.body);
      const baserowUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_EVENTS_TABLE_ID}/?user_field_names=true`;

      const baserowResponse = await axios.post(
        baserowUrl,
        requestBody,
        {
          headers: {
            'Authorization': `Token ${process.env.NEXT_PUBLIC_BASEROW_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (baserowResponse.status === 200 || baserowResponse.status === 201) {
        res.status(200).json({ message: 'Record created successfully', data: baserowResponse.data });
      } else {
        res.status(baserowResponse.status).json({
          error: 'Failed to create record',
          details: JSON.stringify(baserowResponse.data)
        });
      }
    } catch (error) {
      console.error('Error in POST request:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.response ? JSON.stringify(error.response.data) : 'No response data'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
