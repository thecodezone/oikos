import "./ContextMenu.css"

const EdgeContextMenu = ({
    rightClickItem,
    positionX,
    positionY,
    isToggled,
    buttons,
    contextMenuRef
}) => {
    return (
        <menu
            style={{
                top: positionY + 150 + "px",
                left: positionX + 2 + "px"
            }}
            className={`context-menu ${isToggled ? 'active' : ''}`}
            ref={contextMenuRef}
        >
            {buttons.map((button, index) => {

                function handleClick(e) {
                    button.onClick(e)
                }

                return (
                    <button 
                    onClick={handleClick} 
                    key={index} 
                    className="context-menu-button">
                        <span>{button.text}</span>
                        <span className="icon">{button.icon}</span>
                    </button>
                )
            })}
        </menu>
    )
}

export default EdgeContextMenu;