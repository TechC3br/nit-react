import React from "react";

function Registration() {
    return (
        <div className="columns">
            <div className="column is-half">
                <div className="field">
                    <p className="title">Registration Form</p>
                    <div className="control is-large is-loading">
                        <input className="input is-large" type="text" placeholder="Enter Name" />
                    </div>
                    <div className="control is-large is-loading">
                        <input className="input is-large" type="email" placeholder="Enter Email" />
                    </div>
                    <div className="control is-large is-loading">
                        <input className="input is-large" type="password" placeholder="Enter Password" />
                    </div>
                    <div className="control is-large is-loading">
                        <input className="input is-large" type="password" placeholder="Enter Confirm Password" />
                    </div>
                    <div className="buttons">

                        <button className="button is-success">Signup</button>

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Registration;