import TopBar from "../components/TopBar";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import PlayCard from "../components/PlayCard";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';

export default function LobbyPage() {

  return (
      <Box sx={{minHeight: '100vh', backgroundColor: "#F4EFEA"}}>
        <TopBar />

        <Box
            sx={{
              boxSizing: "border-box",
              width: "100%",
              px: "56px",
              pt: "34px",
              pb: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "28px"
            }}
        >

          {/*heading row*/}
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
            <Box>
              <Typography sx={{fontFamily: '"Roboto Mono Variable", monospace', fontSize: "11px", fontWeight: 'bold', color: "#FF4D4D"}}>
                Welcome Back, Goat!
              </Typography>

              <Typography sx={{fontFamily: "Inter", fontSize: "32px", fontWeight: 800, color: 'black', lineHeight: 1.5}}>
                Dive In
              </Typography>
            </Box>

            <Typography variant="overline" sx={{fontFamily: '"Roboto Mono Variable", monospace', fontSize: "11px", color: "#72706F"}}>
              WORCESTER, MA / 42.274° N · 71.808° W
            </Typography>
          </Box>

          {/*play card*/}
          <PlayCard />

          {/*how to play steps*/}
          <Box sx={{display: 'flex', flexDirection: 'column', gap: "24px"}}>
            <Typography sx={{fontFamily: "Inter", fontSize: "20px", fontWeight: 800, color: 'black'}}>
              How to play?
            </Typography>

            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
              {/*step 1*/}
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "14px"}}>
                <SearchIcon sx={{color: "#D83438"}}/>
                <Box>
                  <Typography sx={{fontFamily: "Inter", fontSize: "14px", fontWeight: 'bold', color: 'black', lineHeight: 1.1}}>
                    01/Look for clues
                  </Typography>

                  <Typography sx={{fontFamily: "Inter", fontSize: "12px", color: "#72706F"}}>
                    Notice the architecture, paths, and familiar details in each photo.
                  </Typography>
                </Box>
              </Box>

              {/*step 2*/}
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "14px"}}>
                <LocationOnOutlinedIcon sx={{color: "#D83438"}}/>
                <Box>
                  <Typography sx={{fontFamily: "Inter", fontSize: "14px", fontWeight: 'bold', color: 'black', lineHeight: 1.1}}>
                    02 / Drop your pin
                  </Typography>

                  <Typography sx={{fontFamily: "Inter", fontSize: "12px", color: "#72706F"}}>
                    Pick the spot on the campus map where you think the photo was taken.
                  </Typography>
                </Box>
              </Box>

              {/*step 3*/}
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "14px"}}>
                <OutlinedFlagOutlinedIcon sx={{color: "#D83438"}}/>
                <Box>
                  <Typography sx={{fontFamily: "Inter", fontSize: "14px", fontWeight: 'bold', color: 'black', lineHeight: 1.1}}>
                    03 / See how close
                  </Typography>

                  <Typography sx={{fontFamily: "Inter", fontSize: "12px", color: "#72706F"}}>
                    Reveal the location and discover a new side of your campus.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
  )
}