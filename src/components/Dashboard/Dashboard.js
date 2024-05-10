import { useEffect, useState } from "react";
import { dashboardServices } from "../../services/dashboardServices";
import Header from "../Header/Header";

const Dashboard = (props) => {
  const [admin, setAdmin] = useState()
  const getDashboard = new dashboardServices();

  const [data, setData] = useState({
    user: {
      meta: 0,
      lastWeekMeta: 0,
      lastTowWeekMeta: 0,
    },
    nfts: {
      meta: 0,
      lastWeekMeta: 0,
      lastTwoWeekMeta: 0,
    },
    curation: {
      meta: 0,
      lastWeekMeta: 0,
      lastTwoWeekMeta: 0,
    },
    artist: {
      meta: 0,
      lastWeekMeta: 0,
      lastTwoWeekMeta: 0,
    },
  });

  const getDashboardMetaData = async () => {
    const { data } = await getDashboard.getAllDashboardData();
    setData(data);
  };

  const uiSchima = ["All users", "All NFTs", "All Curations", "All Artists"];
  const mapping = {
    user: "All users",
    nfts: "All NFTs",
    curation: "All Curations",
    artist: "All Artists",
  };

  useEffect(() => {
    getDashboardMetaData();
  }, []);

  useEffect(() => {
    const admin = localStorage.getItem("admin")
    admin && setAdmin(JSON.parse(admin))
  }, [])

  return (
    <>
      {props.render}
      <section className="dashboard__area">
      <Header />
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h4>Hello, {admin?.name}!</h4>
              <p>Welcome to VoultX admin Page</p>
            </div>
          </div>
        </div>
        <div className="dashboard__card__area">
          <div className="row g-4">
            {uiSchima.map((value, index) => {
              let tempData = data;

              for (let d in data) {
                if (mapping[d] === value) {
                  tempData = data[d];
                }
              }

              const color =
                tempData.lastWeekMeta > tempData.lastTwoWeekMeta
                  ? "green_color"
                  : "red_color";
              const arrow =
                tempData.lastWeekMeta > tempData.lastTwoWeekMeta
                  ? "assets/img/green_arrow_up.svg"
                  : "assets/img/red_arrow_down.svg";
                  const sign =tempData.lastWeekMeta > tempData.lastTwoWeekMeta ? '+': '-';


                  const percents =tempData.lastTwoWeekMeta>0? (tempData.lastWeekMeta / tempData.lastTwoWeekMeta)*100 :tempData.lastWeekMeta;
              return (
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                  <div className="dasaboard__card__wraper">
                    <div className="dashboard__card__top">
                      <div className="dashboard__card__content">
                        <h4>{tempData.meta}</h4>
                        <p>{value}</p>
                      </div>
                      <div className="dashboard__card__ico">
                        <a href="#">
                          <img src="assets/img/dashboard_ico_2.svg" alt="" />
                        </a>
                      </div>
                    </div>
                    <div className="dashboard__bottom__content">
                      <p>
                        <span className={color}>
                          <img src={arrow} alt="" /> {tempData.lastWeekMeta}
                        </span>{" "}
                        {sign}{percents}% this week
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
