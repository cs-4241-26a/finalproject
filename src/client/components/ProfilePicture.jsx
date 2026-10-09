function ProfilePicture({name, alttext, width="100px", height="100px"}) {
    if (name == null || name === "none" || name === "") {
        name = "default"
    }
    if (alttext == null || alttext === "none" || alttext === "") {
        alttext = "Profile Picture"
    }
    return (
        <div style = {{backgroundColor: "#dc3545", width:`${width}`, height:`${height}`}} className = "d-flex justify-content-center rounded me-2 border border-3">
            <img style = {{position:"relative", height:"100%"}} src={"../../../profilePictures/"+name+".png"} alt={alttext} className="align-self-center"/>
        </div>
    )
}
export default ProfilePicture;
