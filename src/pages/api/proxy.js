import axios from 'axios';

export default async function handler(req, res) {
  const { page } = req.query;
  const apiUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_EVENTS_TABLE_ID}/?page=${page}&user_field_names=true`;

  try {
    const apiResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_BASEROW_KEY}`,
      },
    });

    res.status(200).json(apiResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
}
