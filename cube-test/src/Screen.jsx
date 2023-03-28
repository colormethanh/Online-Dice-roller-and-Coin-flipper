import { useState, useEffect } from 'react' 
import './screen.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRotateLeft } from "@fortawesome/free-solid-svg-icons";


function SideBarItem({ name, id, isVisable }) {
    const [isHover, setIsHover] = useState(false);
    return (
      <div className="side-bar-item">
        <div className="side-bar-outer ">
          <div
            className={isVisable ? "item-inner item-up" : "item-inner item-down"}
            id={id}
          >
            <div
              className={isHover ? "glitched" : ""}
              title={name}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {name}
            </div>
          </div>
        </div>
      </div>
    );
}

export default function Screen() {
    const [isVisable, setIsVisable] = useState(false);
    const [isResetHover, setIsResetHover] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    });

    const handleClick = () => {
        if (isVisable) {
          setIsVisable(false);
        } else {
          setIsVisable(true);
        }
      };

    return (
        <div className='Wrapper'>
            <div className={"hamburg"} onClick={handleClick}>
                <FontAwesomeIcon
                    icon={faBars}
                    size="2xl"
                    style={{ color: "#ffffff" }}
                />
            </div>
            <div
                className={isResetHover ? "reset-btn rotate" : "reset-btn"}
                onMouseEnter={() => setIsResetHover(true)}
                onMouseLeave={() => setIsResetHover(false)}
            >
                <FontAwesomeIcon icon={faRotateLeft} size="2xl" style={{ color: "#ffffff" }}/>
            </div>
            <div
                className={isLoading ? "side-bar-wrapper hidden" : "side-bar-wrapper"}
            >
                <SideBarItem name={"Reset"} id={"item1"} isVisable={isVisable} />
                <SideBarItem name={"Load Dice"} id={"item2"} isVisable={isVisable} />
                <SideBarItem name={"Load Coin"} id={"item3"} isVisable={isVisable} />
                <SideBarItem name={"Credits"} id={"item4"} isVisable={isVisable} />
            </div>
            <div className="center-item">head</div>
        </div>
    )
}