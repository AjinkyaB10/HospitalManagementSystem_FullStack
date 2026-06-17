package com.hospital.controller;

import com.hospital.model.*;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import com.hospital.service.PatientService;
import com.hospital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();

        Patient patient = patientService.getPatientByUser(user).orElseGet(() -> {
            Patient newPatient = new Patient();
            newPatient.setUser(user);
            return patientService.savePatient(newPatient);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("patient", patient);
        response.put("appointments", appointmentService.getAppointmentsByPatient(patient));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping("/book-appointment")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> request,
                                              Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientService.getPatientByUser(user).orElseThrow();
        Doctor doctor = doctorService.getDoctorById(
            Long.parseLong(request.get("doctorId").toString())).orElseThrow();

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setSymptoms((String) request.get("symptoms"));
        appointment.setAppointmentDate(
            java.time.LocalDate.parse((String) request.get("appointmentDate")));
        appointment.setAppointmentTime(
            java.time.LocalTime.parse((String) request.get("appointmentTime")));

        appointmentService.saveAppointment(appointment);
        return ResponseEntity.ok("Appointment booked successfully!");
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> viewAppointments(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientService.getPatientByUser(user).orElseThrow();
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patient));
    }

    @PutMapping("/appointments/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok("Appointment cancelled!");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientService.getPatientByUser(user).orElseThrow();
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Patient updatedPatient,
                                            Principal principal) {
        User user = userService.findByEmail(principal.getName()).orElseThrow();
        Patient existing = patientService.getPatientByUser(user).orElseGet(() -> {
            Patient newPatient = new Patient();
            newPatient.setUser(user);
            return newPatient;
        });

        existing.setPhone(updatedPatient.getPhone());
        existing.setAge(updatedPatient.getAge());
        existing.setBloodGroup(updatedPatient.getBloodGroup());
        existing.setAddress(updatedPatient.getAddress());

        patientService.savePatient(existing);
        return ResponseEntity.ok("Profile updated successfully!");
    }
}