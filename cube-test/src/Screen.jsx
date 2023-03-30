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
    const [isFlippable, setIsFlippable] = useState(false);

    const scene=props.scene;
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        if (props.sceneState === 'dice' || props.sceneState === 'coin') {
            setIsFlippable(true);
            console.log("flippable");
        } else {
            setIsFlippable(false);
            console.log("unflippable");
        }
    });

    const handleClick = () => {
        if (isVisable) {
          setIsVisable(false);
        } else {
          setIsVisable(true);
        }
      };

    const handleFlip = () => {
        console.log(scene.state)
        // props.setSceneState(scene.state)
        if (scene.state === 'dice') {
            scene.throwDice();
        } 
        else if (scene.state === 'coin') {
            scene.flipCoin();
        }
    }

    const selectCoin = () => {
        scene.removeDice();
        scene.selectCoin();
        props.setSceneState(scene.state);
    }

    const selectDice = () => {
        scene.removeCoin();
        scene.selectDice();
        props.setSceneState(scene.state);
    }

    const selectState = () => {
        scene.selectState();
        props.setSceneState(scene.state);
    }

    const setState = () =>{
        props.setSceneState(scene.state);
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
                className={isLoading ? 'side-bar-wrapper hidden' : 'side-bar-wrapper'}
            >
                <SideBarItem name={"Reset"} id={"item1"} isVisable={isVisable} onClick={selectState} order={1} />
                <SideBarItem name={"Load Dice"} id={"item2"} isVisable={isVisable} onClick={selectDice} order={2} />
                <SideBarItem name={"Load Coin"} id={"item3"} isVisable={isVisable} onClick={selectCoin} order={3} />
                <SideBarItem name={"Credits"} id={"item4"} isVisable={isVisable} order={5} />
            </div>
            <div className='center-item'>head</div>
            <div className='button-wrapper' id='flip-btn'>
                <div className='button-container' onClick={handleFlip} onMouseEnter={setState}>{ props.sceneState !== "select" ? (props.sceneState === 'dice' ? 'roll ' + props.sceneState: 'flip ' + props.sceneState ) : props.sceneState}</div>
            </div>
        </div>
    )
}