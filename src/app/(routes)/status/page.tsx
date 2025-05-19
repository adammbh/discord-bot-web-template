"use client"
import { AxiosPromise, AxiosRequestConfig } from "axios"
import useAxios, { RefetchOptions } from "axios-hooks"
import { RefreshCwIcon } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"
import { HiServerStack } from "react-icons/hi2"
import { ImConnection } from "react-icons/im"
import { MdOutlineTimeline } from "react-icons/md"
import { PiWifiSlashBold } from "react-icons/pi"

const fetchShard = async (shardId: number) => {
    const response = await fetch(`https://api.yourbot.bot/status`)
    if (!response.ok) {
        console.error("Failed to fetch shard data")
        return null
    }
    const data = await response.json()
    const shardData = data.shards[shardId]

    let shard: IShard
    shard = {
        id: shardData.id,
        guilds: parseInt(shardData.guilds),
        users: parseInt(shardData.users.replace(/,/g, "")),
        ping: parseFloat(shardData.ping),
        uptime: shardData.uptime
    }
    return shard
}

export default function Status() {
    const [{ data, loading, error }, refetch] = useAxios({
        baseURL: "https://api.yourbot.bot",
        url: "/status"
    })

    let shards: IShard[] = []
    let overview = {
        avgLatency: 0,
        totalServers: 0,
        totalUsers: 0,
        uptime: "0h 0m"
    }

    if (!error && data) {
        shards = data.shards.map((shard: any) => ({
            id: shard.id,
            guilds: parseInt(shard.guilds),
            users: parseInt(shard.users.replace(/,/g, "")),
            ping: parseFloat(shard.ping),
            uptime: shard.uptime
        }))

        const earliestUptime = Math.min(...shards.map(shard => shard.uptime))
        const uptimeMs = Date.now() - earliestUptime * 1000
        const hours = Math.floor(uptimeMs / (1000 * 60 * 60))
        const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60))

        overview = {
            avgLatency: Math.round(
                shards.reduce((acc, shard) => acc + shard.ping, 0) / shards.length
            ),
            totalServers: shards.reduce((acc, shard) => acc + shard.guilds, 0),
            totalUsers: shards.reduce((acc, shard) => acc + shard.users, 0),
            uptime: `${hours}h ${minutes}m`
        }
    }

    const OverviewCard = () => (
        <div className="w-full rounded-3xl bg-yourbot-900/50 border border-yourbot-pink/20 p-6 mb-8 mt-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-white">All Systems Operational</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-yourbot-pink">
                        <ImConnection />
                        <span>Avg. Latency</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{overview.avgLatency}ms</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-yourbot-pink">
                        <HiServerStack />
                        <span>Total Servers</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                        {overview.totalServers.toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-yourbot-pink">
                        <FaUsers />
                        <span>Total Users</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                        {overview.totalUsers.toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-yourbot-pink">
                        <MdOutlineTimeline />
                        <span>Uptime</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{overview.uptime}</p>
                </div>
            </div>
        </div>
    )

    const ShardSkeleton = () => (
        <div className="flex flex-col py-6 rounded-3xl bg-yourbot-900/50 border border-yourbot-pink/20 animate-pulse">
            <div className="px-6 space-y-4">
                <div className="flex justify-between">
                    <div className="h-6 w-24 bg-yourbot-pink/10 rounded"></div>
                    <div className="h-6 w-32 bg-yourbot-pink/10 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-yourbot-pink/10 rounded"></div>
            </div>
            <hr className="border-t border-yourbot-pink/10 w-full my-4" />
            <div className="grid grid-cols-2 gap-4 px-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="h-4 w-16 bg-yourbot-pink/10 rounded"></div>
                        <div className="h-5 w-24 bg-yourbot-pink/10 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <>
            {error && (
                <main className="pt-20 mx-10">
                    <section className="max-w-5xl mx-auto w-full pb-20 -mt-[4rem]">
                        <div className="flex flex-col items-center justify-center pb-[40vh] pt-20">
                            <PiWifiSlashBold className="text-6xl text-yourbot-pink" />
                            <p className="text-2xl font-medium text-yourbot-pink">No Status Found</p>
                        </div>
                    </section>
                </main>
            )}
            {loading ? (
                <main className="pt-20 mx-10">
                    <section className="max-w-5xl mx-auto w-full pb-20 -mt-[4rem]">
                        <div className="animate-pulse mb-8">
                            <div className="h-32 bg-yourbot-900/50 rounded-3xl"></div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <ShardSkeleton key={i} />
                            ))}
                        </div>
                    </section>
                </main>
            ) : (
                !error && (
                    <>
                        <div className="relative border-b border-yourbot-pink/20 bg-black/20">
                            <div className="absolute inset-0 top-0 bg-[url('/noise.png')] opacity-5" />
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 relative">
                                <div className="text-center">
                                    <span className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-yourbot-pink bg-clip-text text-transparent block">
                                        Status
                                    </span>
                                    <p className="text-base sm:text-lg text-yourbot-pink max-w-3xl mx-auto">
                                        Monitor real-time performance across all shards.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <main className="mx-10">
                            <section className="max-w-5xl mx-auto w-full pb-20">
                                <OverviewCard />
                                <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3">
                                    {shards.map((shard, index) => (
                                        <Shard key={index} shard={shard} refetch={refetch} />
                                    ))}
                                </div>
                            </section>
                        </main>
                    </>
                )
            )}
        </>
    )
}

const Shard = ({
    shard,
    refetch
}: {
    shard: IShard
    refetch: (
        config?: string | AxiosRequestConfig<any> | undefined,
        options?: RefetchOptions
    ) => AxiosPromise<any>
}) => {
    const [counter, setCounter] = useState(0)
    const uptime = new Date(shard.uptime * 1000)

    const handleRefreshClick = async () => {
        const refreshed = await fetchShard(parseInt(shard.id))
        if (!refreshed) return
        shard = refreshed
        setCounter(0)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prevCounter => prevCounter + 1)
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div
            className={`flex flex-col py-6 rounded-3xl bg-yourbot-900/50 border transition-shadow duration-200 ease-linear border-yourbot-pink/20 text-white`}>
            <div className="h-full flex flex-col justify-between">
                <div className="px-6">
                    <div className="flex items-start justify-between gap-x-4">
                        <div className="flex items-center gap-2">
                            <p className="text-xl font-semibold inline-flex items-center">
                                Shard {shard.id}
                            </p>
                        </div>
                        <div
                            className={`flex justify-center items-center bg-yourbot-900/50 border border-yourbot-pink/20 rounded-xl px-2 py-1 gap-2`}>
                            <div
                                className={`w-4 h-4 bg-green-500 rounded-full animate-pulse`}></div>
                            <p className="text-lg font-normal inline-flex items-center text-green-500">
                                Operational
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <RefreshCwIcon
                            className="text-yourbot-pink hover:text-white hover:cursor-pointer"
                            size={20}
                            onClick={() => handleRefreshClick()}
                        />
                        <p className="text-sm text-yourbot-pink">
                            {counter == 0 ? "Just Now" : counter + "s ago"}
                        </p>
                    </div>
                </div>
                <hr className="border-t border-yourbot-pink/10 w-full my-4" />
                <div className="grid grid-cols-2 gap-4 px-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-yourbot-pink">Uptime</p>
                        <div className="flex flex-row gap-2 items-center">
                            <MdOutlineTimeline className="text-yourbot-pink" />
                            <p className="text-md font-semibold">
                                {shard.uptime == 0
                                    ? "N/A"
                                    : moment.duration(uptime.getTime() - Date.now()).humanize()}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-yourbot-pink">Latency</p>
                        <div className="flex flex-row gap-2 items-center">
                            <ImConnection className="text-yourbot-pink" />
                            <p className="text-md font-semibold">{shard.ping}ms</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-yourbot-pink">Servers</p>
                        <div className="flex flex-row gap-2 items-center">
                            <HiServerStack className="text-yourbot-pink" />
                            <p className="text-md font-semibold">{shard.guilds.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-md text-yourbot-pink">Users</p>
                        <div className="flex flex-row gap-2 items-center">
                            <FaUsers className="text-yourbot-pink" />
                            <p className="text-md font-semibold">{shard.users.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface IShard {
    id: string
    guilds: number
    users: number
    ping: number
    uptime: number
}
