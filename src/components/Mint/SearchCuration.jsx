import { useEffect, useRef, useState } from 'react'
import { getCurations } from '../../services/mintServices'

export default function SearchCuration({ onSelect }) {

    const [search, setSearch] = useState(null)
    const [data, setData] = useState([])
    const [pagination, setPagination] = useState(null)
    const containerRef = useRef(null)
    const [fetched, setFetched] = useState(false)

    const searchCuration = async () => {
        const response = await getCurations({
            search: search,
            limit: 10,
            page: pagination.current
        })

        if (response) {
            setData(response.collections)
            setPagination({
                total: response.totalPages,
                current: response.currentPage
            })
        }
    }

    const fetchMore = async () => {
        setFetched(true)
        const response = await getCurations({
            search: search,
            limit: 10,
            page: pagination.current <= pagination.total ? pagination.current + 1 : pagination.current
        })

        if (response) {
            setData([...data, ...response.collections])
            setPagination({
                total: response.totalPages,
                current: response.currentPage
            })
            setFetched(false)
        }
    }


    useEffect(() => {
        const fetchCurations = async () => {
            const response = await getCurations({
                search: search,
                limit: 10,
                page: 1
            })

            if (response) {
                setData(response.collections)
                setPagination({
                    total: response.totalPages,
                    current: response.currentPage
                })
            }
        }

        fetchCurations()
    }, [])
    return (
        <div>
            <h1 className='text-white font-medium'>Mint</h1>

            <div className='single__edit__profile__step link__input relative'>
                <input
                    type="text"
                    placeholder="Search Curation"
                    className="search__input"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <img src="assets/img/search-icon.png" alt="search" className="absolute" style={{
                    position: 'absolute',
                    top: '20px',
                    right: '40px',
                    cursor: 'pointer'
                }}
                onClick={searchCuration}
                />
            </div>

            <div 
                ref={containerRef}
                className='rounded-md my-5' 
                style={{
                backgroundColor: '#161616',
                borderRadius: '20px',
                padding: '20px',
                maxHeight: '60vh',
                overflowY: 'auto'
                }}
                onScroll={async (e) => {
                    if (e.target.scrollHeight - e.target.scrollTop < 300 && !fetched) {
                        console.log('run')
                        await fetchMore()
                    }
                }}
            >
                {
                    data.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className='px-2 py-2' style={{
                                    display: 'flex',
                                    gap: '20px', 
                                    alignItems: 'center'
                                }}
                                onClick={() => onSelect(item)}
                                >
                                    <img src={item.logo} style={{
                                        height: '50px',
                                        width: '50px',
                                        borderRadius: '5px',
                                        objectFit: 'cover'
                                    }} />
                                    <div className='flex flex-col justify-around'>
                                        <p className='text-white text-sm'>{item.name}</p>
                                        <p className='text-white' style={{
                                            marginBottom: '0'
                                        }}>{item.description.length > 100 ? `${item.description.slice(0, 100)}..` : item.description}</p>
                                    </div>
                                </div>
                                {
                                    index === data.length - 1 ?
                                    null : 
                                    <hr className='bg-white' />
                                }
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
