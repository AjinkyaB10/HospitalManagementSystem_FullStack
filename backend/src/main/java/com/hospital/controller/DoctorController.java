package com.hospital.controller;

import com.hospital.model.AppointmentStatus;
import com.hospital.model.Doctor;
import com.hospital.model.User;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import com.hospital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
        Map<String, Object> response = new HashMap<>();
        response.put("doctor", doctor);
        response.put("appointments", appointmentService.getAppointmentsByDoctor(doctor));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> viewAppointments(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctor));
    }

    @PutMapping("/appointments/confirm/{id}")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, AppointmentStatus.CONFIRMED);
        return ResponseEntity.ok("Appointment confirmed!");
    }

    @PutMapping("/appointments/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok("Appointment cancelled!");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorService.getDoctorByUser(user).orElseThrow();
        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Doctor updatedDoctor,
                                            Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Doctor existing = doctorService.getDoctorByUser(user).orElseThrow();

        existing.setSpecialization(updatedDoctor.getSpecialization());
        existing.setExperience(updatedDoctor.getExperience());
        existing.setAvailableDays(updatedDoctor.getAvailableDays());
        existing.setAvailableTime(updatedDoctor.getAvailableTime());
        existing.setFees(updatedDoctor.getFees());

        doctorService.saveDoctor(existing);
        return ResponseEntity.ok("Profile updated successfully!");
    }
}