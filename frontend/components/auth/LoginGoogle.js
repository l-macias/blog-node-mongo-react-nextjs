import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";

import { GoogleLogin } from "@react-oauth/google";

const LoginGoogle = () => {
    const responseGoogle = (response) => {
        const tokenId = response.credential;

        const user = { tokenId };
        loginWithGoogle(user).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`);
                    } else {
                        Router.push(`/user`);
                    }
                });
                console.log("Redirigiendo al usuario...");
            }
        });
    };

    return (
        <div className="pb-3">
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={(responseGoogle) => {
                    console.log(
                        `Ha fallado el login con Google: ${responseGoogle}`
                    );
                }}
            />
        </div>
    );
};
export default LoginGoogle;
