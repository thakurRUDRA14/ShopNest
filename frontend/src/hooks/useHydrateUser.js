import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser, clearErrors } from "../slices/userSlice";

export const useHydrateUser = (shouldHydrate = true) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!shouldHydrate) return;

        const hydrate = async () => {
            await dispatch(loadUser());
            dispatch(clearErrors());
        };

        hydrate();
    }, [dispatch, shouldHydrate]);
};
