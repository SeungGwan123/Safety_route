package Safety_route.Safety_route.CCTV.controller;

import Safety_route.Safety_route.CCTV.Model.CCTV;
import Safety_route.Safety_route.CCTV.service.CCTVservice;
import Safety_route.Safety_route.CCTV.service.CCTVserviceImpl;
import Safety_route.Safety_route.DTO.currentLocation;
import Safety_route.Safety_route.DTO.respDto;
import Safety_route.Safety_route.DTO.startToEnd;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller @RequiredArgsConstructor
public class CCTVcontroller {
    private final CCTVservice cctvService;

    @GetMapping("/Safety_route/walking")
    public ResponseEntity<?> walkingRoute(@RequestBody startToEnd ste) {
        System.out.println("Received walkingRoute request with data: " + ste);
        String result = cctvService.walkingUrl(ste);
        return new ResponseEntity<>(new respDto<>(1,result), HttpStatus.OK);
    }

    @GetMapping("/Safety_route/CCTV/searching")
    public ResponseEntity<?> cctvCount(@RequestBody currentLocation cl) {
        List<CCTV> result = cctvService.searchCctv(cl);
        return new ResponseEntity<>(new respDto<>(1,result), HttpStatus.OK);
    }
}
