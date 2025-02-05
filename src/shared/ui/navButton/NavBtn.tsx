import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/button/ui/Button";
import edit from "@shared/assets/images/profile/edit.svg";

const NavBtn = () => {
  const navigate = useNavigate();
  return (
    <Button
      className="imgBtn"
      imgUrl={edit}
      altText="프로필 수정"
      onClick={() => navigate("/mypage/edit")}
    />
  );
};

export default NavBtn;
