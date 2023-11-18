import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { eventID } = req.query;
    const baserowUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_EVENTS_TABLE_ID}/${eventID}/?user_field_names=true`;

    try {
      const baserowResponse = await axios.patch(
        baserowUrl,
        req.body,
        {
          headers: {
            'Authorization': `Token ${process.env.NEXT_PUBLIC_BASEROW_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (baserowResponse.status === 200) {
        res.status(200).json({ message: 'Record updated successfully', data: baserowResponse.data });
      } else {
        res.status(baserowResponse.status).json({
          error: 'Failed to update record',
          details: JSON.stringify(baserowResponse.data)
        });
      }
    } catch (error) {
      console.error('Error in PATCH request:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.response ? JSON.stringify(error.response.data) : 'No response data'
      });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
