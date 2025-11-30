import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiMember from '../../API/apiMember';
import refershToken from '../../RefershToken/RefershToken';
import { toast } from 'react-toastify';
function BlogDetail() {
    const token = localStorage.getItem('token');
    const [input, SetInput] = useState({});
    const [comment, SetComment] = useState('');
    const [commentreplay, SetCommentReplay] = useState('');
    const { id } = useParams();
    const user = localStorage.getItem('user');
    const level = 0;
    const levelreplay = 1;
    const [InputComment, SetInputComment] = useState([]);
    const [checkValueComment, SetcheckValueComment] = useState();
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
    };
    function getDataBlog() {
        apiMember
            .get('/blog/' + id)
            .then((res) => {
                SetInput(res.data.data);
                console.log(res.data);
            })
            .catch((error) => console.log(error));
    }
    function getDataComment() {
        apiMember
            .get('/comment/' + id)
            .then((res) => {
                SetInputComment(res.data.data);
                console.log(res.data);
            })
            .catch((error) => console.log(error));
    }
    useEffect(() => {
        getDataBlog();
        getDataComment();
    }, []);
    function handleChangInputCommenReplay(e) {
        const value = e.target.value;
        SetCommentReplay(value);
    }
    function SetValueComment(id) {
        SetcheckValueComment(id);
    }
    function ReplayComment(id) {
        return (
            <div className="replay_comment">
                <textarea
                    onChange={handleChangInputCommenReplay}
                    value={commentreplay}
                    placeholder="Nhập bình luận..."
                ></textarea>
                <div className="action">
                    <button className="exit" onClick={() => ExitComment()}>
                        Exit
                    </button>
                    <button className="post" onClick={() => PostReplayComment(id)}>
                        Post comment
                    </button>
                </div>
            </div>
        );
    }
    function ExitComment() {
        SetcheckValueComment('');
    }
    function PostReplayComment(id_comment) {
        const user = localStorage.getItem('user');
        if (user) {
            if (commentreplay == '') {
                toast.error('Vui lòng nhập comment');
            } else {
                if (user) {
                    const member = JSON.parse(user);
                    const image = JSON.parse(member.avatar);

                    const data = {
                        id_blog: id,
                        id_user: member._id,
                        name_user: member.name,
                        level: levelreplay,
                        comment: commentreplay,
                        image_user: image[0],
                        id_comment: id_comment,
                    };
                    apiMember
                        .post('/comment', data, config)
                        .then((res) => {
                            console.log(res);
                            toast.success('Comment thành công');
                            SetcheckValueComment('');
                            SetCommentReplay('');
                            getDataComment();
                        })
                        .catch(async (error) => {
                            if (error.response) {
                                const status = error.response.status;
                                const message =
                                    error.response.data?.error ||
                                    error.response.data?.errors ||
                                    error.response.data?.message ||
                                    error.message;
                                if (status == 401) {
                                    try {
                                        const newtoken = await refershToken();
                                        if (!newtoken) {
                                            return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                                        }
                                        let config = {
                                            headers: {
                                                Authorization: `Bearer ${newtoken}`,
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                Accept: 'application/json',
                                            },
                                        };
                                        const res2 = await apiMember.post('/comment', data, config);
                                        console.log(res2);
                                        toast.success('Comment thành công');
                                        SetcheckValueComment('');
                                        SetCommentReplay('');
                                        getDataComment();
                                    } catch (refreshError) {
                                        toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                                        console.error(refreshError);
                                    }
                                } else if (status === 403) {
                                    toast.error(message);
                                } else {
                                    if (typeof message === 'object' && message !== null) {
                                        const keys = Object.keys(message);
                                        if (keys.length > 0) {
                                            const firstKey = keys[0];
                                            toast.error('Lỗi khi thêm: ' + message[firstKey]);
                                        }
                                    } else {
                                        toast.error('Lỗi khi thêm: ' + message);
                                    }
                                }
                            } else {
                                toast.error('Không thể kết nối đến server: ' + error.message);
                            }
                        });
                }
            }
        } else {
            toast.warn('Vui lòng đăng nhập');
        }
    }
    function renderDataComment() {
        return InputComment.map((value, index) => {
            return (
                <div>
                    {value.level == 0 && (
                        <li className="media">
                            <a className="pull-left" href="#">
                                <img
                                    className="media-object"
                                    src={`http://localhost:3001/${value.image_user}`}
                                    alt=""
                                />
                            </a>
                            <div className="media-body">
                                <ul className="sinlge-post-meta">
                                    <li>
                                        <i className="fa fa-user" />
                                        {value.name_user}
                                    </li>
                                    <li>
                                        <i className="fa fa-clock" /> 1:33 pm
                                    </li>
                                    <li>
                                        <i className="fa fa-calendar" /> DEC 5, 2013
                                    </li>
                                </ul>
                                <p>{value.comment}</p>
                                <a className="btn btn-primary" onClick={() => SetValueComment(value._id)}>
                                    <i className="fa fa-reply" />
                                    Replay
                                </a>
                            </div>
                            {checkValueComment == value._id && ReplayComment(value._id)}
                        </li>
                    )}
                    {InputComment.map((value1, index) => {
                        return (
                            value1.id_comment === value._id && (
                                <li className="media second-media">
                                    <a className="pull-left" href="#">
                                        <img
                                            className="media-object"
                                            src={`http://localhost:3001/${value1.image_user}`}
                                            alt=""
                                        />
                                    </a>
                                    <div className="media-body">
                                        <ul className="sinlge-post-meta">
                                            <li>
                                                <i className="fa fa-user" />
                                                {value1.name_user}
                                            </li>
                                            <li>
                                                <i className="fa fa-clock" /> 1:33 pm
                                            </li>
                                            <li>
                                                <i className="fa fa-calendar" /> DEC 5, 2013
                                            </li>
                                        </ul>
                                        <p>{value1.comment}</p>
                                        <a className="btn btn-primary" onClick={() => SetValueComment(value1._id)}>
                                            <i className="fa fa-reply" />
                                            Replay
                                        </a>
                                    </div>
                                    {checkValueComment == value1._id && ReplayComment(value._id)}
                                </li>
                            )
                        );
                    })}
                </div>
            );
        });
    }
    function renderData() {
        return (
            <div className="container">
                <div className="title">
                    <h5>{input.title}</h5>
                    <p>{input.description}</p>
                </div>
                <div className="content">
                    <img src={`http://localhost:3001/${input.image}`}></img>
                    <div>{input.content}</div>
                </div>
            </div>
        );
    }
    function handleChangInput(e) {
        const value = e.target.value;
        SetComment(value);
    }
    function handleComment() {
        const user = localStorage.getItem('user');
        if (user) {
            if (comment == '') {
                toast.error('Vui lòng nhập comment');
            } else {
                if (user) {
                    const member = JSON.parse(user);
                    const image = JSON.parse(member.avatar);

                    const data = {
                        id_blog: id,
                        id_user: member._id,
                        name_user: member.name,
                        level: level,
                        comment: comment,
                        image_user: image[0],
                    };
                    apiMember
                        .post('/comment', data, config)
                        .then((res) => {
                            console.log(res);
                            toast.success('Comment thành công');
                            SetComment('');
                            getDataComment();
                        })
                        .catch(async (error) => {
                            if (error.response) {
                                const status = error.response.status;
                                const message =
                                    error.response.data?.error ||
                                    error.response.data?.errors ||
                                    error.response.data?.message ||
                                    error.message;
                                if (status == 401) {
                                    try {
                                        const newtoken = await refershToken();
                                        if (!newtoken) {
                                            return toast.error('Không thể làm mới token. Vui lòng đăng nhập lại.');
                                        }
                                        let config = {
                                            headers: {
                                                Authorization: `Bearer ${newtoken}`,
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                Accept: 'application/json',
                                            },
                                        };
                                        const res2 = await apiMember.post('/comment', data, config);
                                        console.log(res2);
                                        toast.success('Comment thành công');
                                        SetcheckValueComment('');
                                        SetCommentReplay('');
                                        getDataComment();
                                    } catch (refreshError) {
                                        toast.error('Lỗi khi làm mới token. Vui lòng đăng nhập lại.');
                                        console.error(refreshError);
                                    }
                                } else if (status === 403) {
                                    toast.error(message);
                                } else {
                                    if (typeof message === 'object' && message !== null) {
                                        const keys = Object.keys(message);
                                        if (keys.length > 0) {
                                            const firstKey = keys[0];
                                            toast.error('Lỗi khi comment: ' + message[firstKey]);
                                        }
                                    } else {
                                        toast.error('Lỗi khi comment: ' + message);
                                    }
                                }
                            } else {
                                toast.error('Không thể kết nối đến server: ' + error.message);
                            }
                        });
                }
            }
        } else {
            toast.warn('Vui lòng đăng nhập');
        }
    }
    return (
        <div className="blog_member">
            <h3>List Blog Detail</h3>
            {renderData()}
            <div className="rating-area">
                <ul className="ratings">
                    <li className="rate-this">Rate this item:</li>
                    <li>
                        <i className="fa fa-star color" />
                        <i className="fa fa-star color" />
                        <i className="fa fa-star color" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                    </li>
                    <li className="color">(6 votes)</li>
                </ul>
                <ul className="tag">
                    <li>TAG:</li>
                    <li>
                        <a className="color" href>
                            Pink <span>/</span>
                        </a>
                    </li>
                    <li>
                        <a className="color" href>
                            T-Shirt <span>/</span>
                        </a>
                    </li>
                    <li>
                        <a className="color" href>
                            Girls
                        </a>
                    </li>
                </ul>
            </div>
            <div className="socials-share">
                <a href>
                    <img src="/images/blog/socials.png" alt="" />
                </a>
            </div>
            <div className="response-area">
                <h2>{InputComment.length} RESPONSES</h2>
                <ul className="media-list">{renderDataComment()}</ul>
            </div>
            <div className="comment">
                <h4>Comment</h4>
                <textarea placeholder="Nhập bình luận..." value={comment} onChange={handleChangInput}></textarea>
                <button className="post_comment" onClick={() => handleComment()}>
                    Post comment
                </button>
            </div>
        </div>
    );
}
export default BlogDetail;
