import { useState, useEffect, CSSProperties } from 'react' 
import './screen.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRotateLeft } from "@fortawesome/free-solid-svg-icons";


function SideBarItem({ name, id, isVisable, onClick, order }) {
    const [isHover, setIsHover] = useState(false);
    return (
      <div className="side-bar-item" onClick={onClick}>
        <div className="side-bar-outer ">
          <div
            className={isVisable ? "item-inner item-up" : "item-inner item-down"}
            id={id}
            style={{"--animation-order":order }}
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

export default function Screen(props) {
    const [isVisable, setIsVisable] = useState(false);
    const [isResetHover, setIsResetHover] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scene=props.scene;
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    });

    const handleClick = () => {
        if (isVisable) {
          setIsVisable(false);
        } else {
          setIsVisable(true);
        }
      };

    const throwDice = () => {
        console.log("Throwing Dice");
        scene.throwDice();
    }

    const flipCoin = () => {
        console.log("Flipping Coin");
        scene.flipCoin();
    }

    const selectCoin = () => {
        scene.removeDice();
        scene.selectCoin();
    }

    const selectDice = () => {
        scene.removeCoin();
        scene.selectDice();
    }

    const emptyState = () => {
        scene.emptyState();
    }

    const selectState = () => {
        scene.selectState();
    }

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
                onClick={selectState}
            >
                <FontAwesomeIcon icon={faRotateLeft} size="2xl" style={{ color: "#ffffff" }}/>
            </div>
            <div
                className={isLoading ? "side-bar-wrapper hidden" : "side-bar-wrapper"}
            >
                <SideBarItem name={"Reset"} id={"item1"} isVisable={isVisable} onClick={selectState} order={1} />
                <SideBarItem name={"Load Dice"} id={"item2"} isVisable={isVisable} onClick={selectDice} order={2} />
                <SideBarItem name={"Load Coin"} id={"item3"} isVisable={isVisable} onClick={selectCoin} order={3} />
                <SideBarItem name={"Credits"} id={"item4"} isVisable={isVisable} order={5} />
            </div>
            <div className="center-item">head</div>
        </div>
    )
}