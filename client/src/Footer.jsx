import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Nội dung chính của trang */}
        {/* Thêm nội dung của bạn ở đây */}
      </div>

      <div className="bg-pink-500 text-white p-6 sticky bottom-0 w-full">
        <div className="flex justify-between text-center">
          {/* Về Chúng Tôi */}
          <div className="flex-1 mx-4">
            <h4 className="font-bold text-lg mb-2">VỀ CHÚNG TÔI</h4>
            <div className="flex flex-row justify-center gap-4 mt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61553397810748"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook Logo"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://www.youtube.com/@ThanhHung_Le"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                  alt="YouTube Logo"
                  className="w-8 h-8"
                />
              </a>
              <a
                href="https://www.instagram.com/thanh.hungggg_/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                  alt="Instagram Logo"
                  className="w-8 h-8"
                />
              </a>
            </div>
          </div>
          {/* Hỗ trợ khách hàng */}
          <div className="flex-1 mx-4">
          </div>

          {/* Hệ thống cửa hàng */}
          <div className="flex-1 mx-4">
            <h4 className="font-bold text-lg mb-2">HỆ THỐNG CỬA HÀNG</h4>
            <p className="text-white">Số 1, Đường Võ Văn Ngân, Phường Linh Chiểu, Thành Phố Thủ Đức</p>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm">
            © 2024 ONLINE E-STORE - All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
