import { CreateCategoryServices } from "@/services/categoryServices";
import { CreateCurationServices } from "@/services/curationServices";
import { CurationType } from "@/types";
import { useState } from "react";
import { UserProjectMap } from "../dto";
import { getAllArtists } from "@/services/services";

const categoryServices = new CreateCategoryServices();
const curationServices = new CreateCurationServices();

export const useBulkFetch = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [curations, setCurations] = useState<CurationType[]>([]);
  const [userDetails, setUserDetails] = useState<UserProjectMap>({});

  const fetchCategoryList = async () => {
    const { data: { categories = [{}], categoriesMeta = 0 } = {} } =
      await categoryServices.getAllCategory({
        skip: 0,
        limit: 10
      });
    setCategories(categories);
  }

  const fetchCurations = async () => {
    const { data: { curations = [{}], curationCount = 0 } = {} } =
      await curationServices.getAllCollections({
        searchInput: "",
        skip: 0,
        limit: 100,
        filter: null,
      });
    setCurations(curations);
  }

  const fetchArtists = async () => {
    const { data } = await getAllArtists();
    setUserDetails(data);
  }

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCategoryList(), fetchCurations(), fetchArtists()]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return { loading, setLoading, categories, curations, userDetails, fetchAll };
}
