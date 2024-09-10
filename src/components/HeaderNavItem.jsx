import React, { useEffect, useState } from "react";
import axios from "axios";
import { HOST_URL, GETCUSER } from "../config";
import { format } from "date-fns";

function HeaderNavItem() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(HOST_URL + GETCUSER);
        const data = response.data.slice(0, 3);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="/">
          <i className="far fa-comments" />
          <span className="badge badge-danger navbar-badge">
            {messages.length}
          </span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          {messages.map((message, index) => (
            <a key={index} href="/" className="dropdown-item">
              {/* Message Start */}
              <div className="media">
                <div className="media-body">
                  <div className="row">
                    <div className="col-md-1 text-start">
                      <span className="float-right text-sm">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                    <div className="col-md-11 text-start">
                      <h3
                        className="dropdown-item-title"
                        style={{ fontWeight: "bold" }}
                      >
                        {message.使用者名稱}
                        <span className="text-sm text-danger"></span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted">
                    <i className="far fa-clock mr-1" /> 最後登入時間：
                    {format(new Date(message.程式時間), "yyyy-MM-dd HH:mm")}
                  </p>
                </div>
              </div>
              {/* Message End */}
            </a>
          ))}
          <a href="/" className="dropdown-item dropdown-footer">
            更多訊息
          </a>
        </div>
      </li>
    </>
  );
}

export default HeaderNavItem;
