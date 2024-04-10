package Safety_route.Safety_route.CCTV.service;

import Safety_route.Safety_route.CCTV.Model.CCTV;
import Safety_route.Safety_route.CCTV.repository.CCTVrepository;
import Safety_route.Safety_route.DTO.currentLocation;
import Safety_route.Safety_route.DTO.startToEnd;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service @RequiredArgsConstructor @Log4j2
public class CCTVserviceImpl implements CCTVservice {
    private final CCTVrepository cctvrepository;
    @Override
    public String walkingUrl(startToEnd ste){
        String uri = "http://localhost:5000/route/v1/foot/";
        String uri_End = "?steps=true";
        uri+=(Double.toString(ste.getStart_x())+",");
        uri+=(Double.toString(ste.getStart_y())+";");
        uri+=(Double.toString(ste.getEnd_x())+",");
        uri+=(Double.toString(ste.getEnd_y()));
        uri+=uri_End;
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);

        return result;
    }

    @Override
    public List<CCTV> searchCctv(currentLocation cl){
        double x = cl.getX();
        double y = cl.getY();
        return cctvrepository.searchCctv(x,y);
    }
}
