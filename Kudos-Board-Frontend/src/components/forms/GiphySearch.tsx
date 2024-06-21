import { Carousel } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import type { IGif } from '@giphy/js-types'
import { useEffect, useState } from 'react'
import { TextInput } from '@mantine/core'

interface Props {
    setSelectedGifUrl: (url: string) => void;
}

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY)

const GiphySearch = ({ setSelectedGifUrl }: Props) => {
    const [gifSearchTerm, setGifSearchTerm] = useState<string>('');
    const [selectedGif, setSelectedGif] = useState<IGif | null>(null)

    const handleSetGifSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGifSearchTerm(event.target.value);
    }

    // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    const fetchGifs = (offset: number) => gf.search(gifSearchTerm, { offset, limit: 10 })

    useEffect(() => {
        if (selectedGif != null) {
            setSelectedGifUrl(selectedGif!.images.original.url)
        }
    }, [selectedGif])

    return (
        <>
            <TextInput value={gifSearchTerm} onChange={handleSetGifSearchTerm} label="Search Gifs" placeholder="Search Gifs" />
            <Carousel gifHeight={200} gutter={6} fetchGifs={fetchGifs} noLink={true} key={gifSearchTerm} onGifClick={setSelectedGif} />
            <img src="/giphyLogo.gif" width="200" alt="Powered by GIPHY" />
        </>
    )
}

export default GiphySearch;
