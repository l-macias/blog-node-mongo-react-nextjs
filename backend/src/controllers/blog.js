class blogController {
  constructor() {}
  async getBlogs(req, res) {
    try {
      return res.json({ time: Date().toString() });
    } catch (error) {
      console.log(`Error in getBlogs: ${error}`);
    }
  }
}
const getBlogs = new blogController().getBlogs;
export default getBlogs;
