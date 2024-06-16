'use client'

export default function ProfilePage({ params }: any) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <h2 className="p-3 bg-green-500 rounded text-white">{params.id}</h2>
            <hr />
        </div>
    )
}
