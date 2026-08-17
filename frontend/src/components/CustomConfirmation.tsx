import { createRoot } from "react-dom/client"

export function confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        const div = document.createElement("div")
        document.body.appendChild(div)

        const root = createRoot(div)

        const close = (result: boolean) => {
            root.unmount()
            div.remove()
            resolve(result)
        }

        root.render(
            <div className="absolute top-0 w-full h-[100vh] bg-black/30 flex items-center justify-center">
                <div className="mb-20 flex flex-col gap-5 items-center justify-center bg-gray-100 w-80 h-40 text-center shadow-lg rounded-2xl">
                    <h2 className="flex items-center justify-center text-[18px] font-bold shadow-xl w-60 h-10 rounded-2xl border border-gray-200">{message}</h2>
                    <div className="w-full flex items-center justify-center gap-10">
                        <button className="w-15 h-10 rounded-xl bg-white shadow-xl border border-gray-200" onClick={() => { close(true) }}>Ok</button>
                        <button className="w-15 h-10 rounded-xl bg-blue-500 text-white shadow-xl" onClick={() => { close(false) }}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    })
}