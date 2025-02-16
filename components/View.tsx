import Ping from "./Ping"

const View = ({ id }: { id: string }) => {
  return (
    <div className="view-container">
        <div className="absolute -top-2 -right-2">
            <Ping />
        </div>

        <p className="view-text">
            <span className="font-black"> 1 View</span>
        </p>
    </div>
  )
}

export default View