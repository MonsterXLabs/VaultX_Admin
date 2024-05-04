import { useEffect, useState } from "react";
import { CreateCategoryServices } from "../../services/categoryServices";
import Pagination from "../Pagination/Pagination";
import Header from "../Header/Header";

function Category(props) {
  const [mode, setMode] = useState("view");
  const [name, setName] = useState("");
  const [artWork, setArtWork] = useState("");
  const [description, setDescription] = useState("");
  const [categoryCount, setCategoryCount] = useState(0);
  const [category, setCategory] = useState([]);
  const [view, setView] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const categoryServices = new CreateCategoryServices();

  const getAllCategoryData = async () => {
    const { data: { categories = [{}], categoriesMeta = 0 } = {} } =
      await categoryServices.getAllCategory({ skip, limit });
    setCategoryCount(categoriesMeta);
    setCategory(categories);
  };

  const handlePagination = async ({ recordsToSkip, recordsToGet }) => {
    setSkip(recordsToSkip);
    setLimit(recordsToGet);
  };

  const saveCategory = async (e) => {
    await categoryServices.createCategory({
      name: name,
      artWork: artWork,
      description: description,
    });
    setMode("view")
    getAllCategoryData();
  };

  const EditCategory = async ({ value }) => {
    setMode("create");
    setView("edit");
    setName(value?.name);
    setDescription(value?.description);
    setArtWork(value?.artWork);
  };
  const DeleteCategory =async(id)=>{
    categoryServices.deleteCategory({'id':id}).then((res)=>{
      if(res.status==200){
        getAllCategoryData()
      }
    })

  }
  const CreateCategory = async () => {
    setMode("create");
    setView("create");
    setName("");
    setDescription("");
    setArtWork("");
  };

  //  set the count of the categories and get all the categories
  useEffect(() => {
    getAllCategoryData();
  }, [categoryCount, skip, limit]);
  return (
    <section className="dashboard__area">
      {props.render}
      <Header />
      <div className={mode === "view" ? "" : "d-none"}>
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h4>Category Management</h4>
              <div className="admin__inner__btn admin__inner__btn__flex">
                <a className="common__btn" onClick={() => CreateCategory()}>
                  Create
                </a>
                <div className="user__price__code">
                  <h4>{categoryCount} Category</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard__table__wrapper regular_td">
          <div className="dashboard__table mt-10">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Artwork</th>
                  <th className="text-center" scope="col">
                    Edit
                  </th>
                  <th className="text-center" scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>Painting</td>
                  <td>155</td>
                  <td>
                    <div className="edet__inner__btn">
                      <a href="#">Edit</a>
                    </div>
                  </td>
                  <td>
                    <div className="table_edit_ico text-center">
                      <a href="#">
                        <img src="assets/img/trash.svg" alt="" />
                      </a>
                    </div>
                  </td>
                </tr> */}
                {category.map((value, index) => {
                  return (
                    <tr>
                      <td scope="col">{value?.name}</td>
                      <td scope="col">{value?.artWork}</td>
                      <td className="text-center" scope="col">
                        <a href="#" onClick={() => EditCategory({ value })}>
                          Edit
                        </a>
                      </td>
                      <td className="text-center" scope="col">
                        <a href="#" onClick={() => DeleteCategory(value._id)}>
                          Delete
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          totalRecords={categoryCount}
          queryPagination={handlePagination}
          limit={limit}
        />
      </div>
      {/* Create */}
      <div className={mode === "create" ? "" : "d-none"}>
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h4>
                Category Management &gt; {view === "edit" ? "Edit" : "Create"}{" "}
                Category
              </h4>
            </div>
          </div>
        </div>
        <div className="bg_less__form mt-20">
          <div className="row gy-4 gx-3">
            <div className="col-xl-6">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Name</label>
                <input
                  className="border-0"
                  type="text"
                  placeholder="Please write the title..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Artwork</label>
                <input
                  className="border-0"
                  type="text"
                  placeholder="Please write the Artwork..."
                  value={artWork}
                  onChange={(e) => setArtWork(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-12">
              <div className="single__edit__profile__step link__input">
                <label htmlFor="#">Description </label>
                <textarea
                  name="#"
                  placeholder="Please write the description..."
                  id=""
                  cols={30}
                  rows={10}
                  defaultValue={""}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="edit__profile__bottom__btn half__width__btn">
          <a className="cancel" onClick={() => setMode("view")}>
            Cancel
          </a>
          <a href="#" onClick={() => saveCategory()}>
            Save{" "}
            <span>
              <img src="assets/img/arrow_ico.svg" alt="" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Category;
