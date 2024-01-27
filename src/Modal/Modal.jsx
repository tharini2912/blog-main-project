import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

const ModalWindow = ({ onClose}) => {
  return (
    <div className="overlay-main">
      <div className="modal-redirect">
        <div className="mm-parent">
        <RxCross2 className="mm-modal" onClick={onClose}/>
        </div>
        
        <h2>MERN Stack Blog version Available</h2>
        <a href="https://blog-version-two.vercel.app">Click here to redirect</a>
       
        
      </div>
    </div>
  );
};

export default ModalWindow;
