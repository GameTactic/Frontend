import { ApiHeader } from '@/types/Games/Index'
import { WowsShipsApiResponse, Ship, WowsShipInfoApiResponse } from '@/types/Games/Wows'
import axios from 'axios'
import { Api, Map } from '@/store/modules/types'
import { JWTRegion } from '@/store/modules/authentication'
import { GameName } from '@/store/modules/room'
import WowsMaps from '@/types/Games/Wows/Maps'

export const getWowsApiData = async (token: string, setGameApi: (api: Api) => void): Promise<void> => {
  const headers: ApiHeader = {
    'Authorization': token,
    'X-Region': JWTRegion['EU'],
    'X-Game': GameName['WOWS']
  }
  const response: WowsShipsApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/ships/`, { headers })
  const pageTotal = response.data.meta.page_total
  let ships: Ship[] = []
  ships = ships.concat(Object.values(response.data.data))
  if (pageTotal > 1) {
    for (let i = 2; i <= pageTotal; i++) {
      const response: WowsShipsApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/ships/?page_no=${i}`, { headers })
      ships = ships.concat(Object.values(response.data.data))
    }
  }
  const gameInfo: WowsShipInfoApiResponse = await axios.get(`${process.env.VUE_APP_MS_WG_API}/wows/encyclopedia/info/`, { headers })
  const wowsMaps = new WowsMaps()
  const maps: Map[] = wowsMaps.getMaps()
  setGameApi({
    name: 'wows.encyclopedia.ships',
    data: ships
  })
  setGameApi({
    name: 'wows.encyclopedia.info',
    data: gameInfo.data.data
  })
  setGameApi({
    name: 'wows.encyclopedia.maps',
    data: maps
  })
}