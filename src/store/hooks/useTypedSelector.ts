import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers";
import {AppDispatch} from '../index'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch