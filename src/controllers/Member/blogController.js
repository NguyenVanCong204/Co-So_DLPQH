import Blog from "../../models/Blog.js";

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.getBlog();
    if (!blog) {
      return res.status(404).json({
        message: "Không tìm thấy Blog !",
      });
    }
    return res.status(200).json({
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const getBlogbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.getBlogbyId(id);
    if (!blog) {
      return res.status(404).json({
        message: "Không tìm thấy Blog !",
      });
    }
    return res.status(200).json({
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
