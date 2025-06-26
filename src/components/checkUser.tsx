"use client"

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkUser } from "@/lib/features/authSlice"
import { AppDispatch, RootState } from "@/lib/store"

const CheckUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { checkedUser } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!checkedUser) {
      dispatch(checkUser())
    }
  }, [dispatch, checkedUser])

  return null // or <></>
}

export default CheckUsers
