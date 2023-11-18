export default async function handler(req, res) {
    const BaserowUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_CLASSES_TABLE_ID}/`;

    try {
        const response = await fetch(`${BaserowUrl}?user_field_names=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${process.env.NEXT_PUBLIC_BASEROW_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
}
