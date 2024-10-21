'use client';
import { useEffect, useState } from "react";
import { CreateAdministratorServices } from "../../services/services";
import { getItemWithExpiry, setItemWithExpiry } from "@/lib/utils";

interface LoginProps {
  onLogin: (tabName: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const administratorService = new CreateAdministratorServices();
      const res = await administratorService.loginAdmin({ id, password });
      setItemWithExpiry("token", res.data.token);
      setItemWithExpiry("isLoggedIn", "true");
      setItemWithExpiry("admin", JSON.stringify(res.data.data));
      setItemWithExpiry("adminAccess", JSON.stringify(res.data.data?.access));
      onLogin("dashboard");
      document.getElementById("body").style.paddingLeft = "280px";
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    document.getElementById("body").style.padding = "0px";
  });

  useEffect(() => {
    if (getItemWithExpiry("isLoggedIn") === "true") {
      onLogin("dashboard");
      document.getElementById("body").style.paddingLeft = "280px";
    }
  }, []);

  return (
    <div
      className="login__page__wrapper"
      style={{ backgroundImage: "url(./assets/img/login_bg.png)" }}
    >
      <div className="container">
        <form action="#">
          <div className="login__form__blk">
            <div className="login__form__title">
              <h4>MonsterX Admin Sign In</h4>
            </div>
            <div className="common__edit__proe__wrap">
              <div className="edit__profile__form">
                <div className="row gy-4 gx-3">
                  <div className="col-12">
                    <div className="single__edit__profile__step">
                      <label htmlFor="#">NAME*</label>
                      <input
                        type="text"
                        placeholder="Enter Name*"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="single__edit__profile__step eye_ico_input">
                      <label htmlFor="#">Password *</label>
                      <input
                        type="text"
                        placeholder="Min. 8 character"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button className="eye_input" type="button">
                        <img src="assets/img/eye_slash.svg" alt="" />
                      </button>
                    </div>
                    <div className="admin__inner__btn">
                      <a
                        className="vaultx__btn common__btn"
                        onClick={handleLogin}
                      >
                        Login
                        <span>
                          <img src="assets/img/arrow_ico.svg" alt="" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
