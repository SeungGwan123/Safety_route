package Safety_route.Safety_route.CCTV.service;

import Safety_route.Safety_route.CCTV.Model.CCTV;
import Safety_route.Safety_route.DTO.currentLocation;
import Safety_route.Safety_route.DTO.startToEnd;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CCTVservice {
    String walkingUrl(startToEnd ste);
    List<CCTV> searchCctv(currentLocation cl);
}
