import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LeftSideMyPD.css';
function LeftSideMyPD() {
    const navigate = useNavigate();
    let [check, SetCheck] = useState('account');
    function Account() {
        navigate('/member/account/update');
        SetCheck('account');
    }
    function MyProduct() {
        navigate('/member/account/product/list');
        SetCheck('myproduct');
    }
    return (
        <div className="col-sm-3">
            <div className="left-sidebar">
                <h2>TÀI KHOẢN</h2>
                <div className="panel-group category-products" id="accordian">
                    {/*category-productsr*/}
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a
                                    href="#"
                                    onClick={() => Account()}
                                    className={check === 'account' ? 'text-yellow' : ''}
                                >
                                    Thông tin cá nhân
                                </a>
                            </h4>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a
                                    href="#"
                                    onClick={() => MyProduct()}
                                    className={check === 'myproduct' ? 'text-yellow' : ''}
                                >
                                    Đơn hàng
                                </a>
                            </h4>
                        </div>
                    </div>
                </div>
                {/*/category-products*/}
            </div>
        </div>
    );
}
export default LeftSideMyPD;
