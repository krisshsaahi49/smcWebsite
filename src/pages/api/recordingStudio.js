import axios from 'axios';

export default async function recordingStudioHandler(req, res) {
  const { page = 1 } = req.query;
  const filterParams = '%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%5D%2C%22groups%22%3A%5B%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%5D%2C%22groups%22%3A%5B%5D%7D%2C%7B%22filter_type%22%3A%22OR%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22single_select_equal%22%2C%22field%22%3A%22Status%22%2C%22value%22%3A%221103789%22%7D%2C%7B%22type%22%3A%22single_select_equal%22%2C%22field%22%3A%22Status%22%2C%22value%22%3A%221103792%22%7D%5D%2C%22groups%22%3A%5B%5D%7D%2C%7B%22filter_type%22%3A%22OR%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22%F0%9F%9A%AA%20Room(s)%22%2C%22value%22%3A%221103763%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22%F0%9F%9A%AA%20Room(s)%22%2C%22value%22%3A%221103760%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22%F0%9F%9A%AA%20Room(s)%22%2C%22value%22%3A%221103768%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22%F0%9F%9A%AA%20Room(s)%22%2C%22value%22%3A%221103777%22%7D%5D%2C%22groups%22%3A%5B%5D%7D%5D%7D';
  const apiUrl = `${process.env.NEXT_BASEROW_API_URL}${process.env.BASEROW_EVENTS_TABLE_ID}/?page=${page}&user_field_names=true&filters=${filterParams}`;

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
