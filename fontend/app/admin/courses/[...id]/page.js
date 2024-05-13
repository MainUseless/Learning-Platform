"use client"

import { useRouter } from 'next/navigation'
 
export default function Page({params}) {
  const router = useRouter()
  return <p>Post: asdasd{params.id}</p>
}