package com.example.ramazan.prayer.notification;

import com.example.ramazan.model.DeviceToken;
import com.example.ramazan.repository.DeviceTokenRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final DeviceTokenRepository repo;

    public void sendToAll(String title,
                          String body){

        List<DeviceToken> tokens =
                repo.findAll();

        for(DeviceToken t : tokens){

            Message message =
                    Message.builder()
                            .setToken(t.getToken())
                            .setNotification(
                                    Notification.builder()
                                            .setTitle(title)
                                            .setBody(body)
                                            .build())
                            .build();

            try{
                FirebaseMessaging
                        .getInstance()
                        .send(message);

            }catch(FirebaseMessagingException e){

                if(e.getMessagingErrorCode() ==
                        MessagingErrorCode.UNREGISTERED){

                    repo.delete(t);
                }
            }
        }
    }
}
