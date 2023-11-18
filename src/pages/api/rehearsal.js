export default async function handler(req, res) {
  const baseUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_ROOMS_TABLE_ID}/`;
  const queryParams = process.env.BASEROW_REHEARSAL_FILTER;
  
  try {
    const response = await fetch(`${baseUrl}${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_BASEROW_KEY}`
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
}

  