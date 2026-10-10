
function UserInfo(props){
    //pfp, username and user bio
    return(
        <>
        <div className="avatarWrap">
            <img src={props.img} alt="Image not found" className="avatar"></img>
        </div>
        <div className="profileText">
            <h1 className="profileName">{props.username}</h1>
            <p className="profileBio">{props.txt}</p>
        </div>
        </>
    )
}
export default UserInfo
