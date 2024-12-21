"use client";
import styles from './login.module.css';
import Image from "next/image";
import React, { useState } from 'react';
import useApi from '@/utils/api';
import { useGlobal } from '@/utils/global';

export default function Login() {
    const api = useApi();
    const { auth } = useGlobal();

    const [EmailInput, setEmail] = useState("");
    const [PasswordInput, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const isFormComplete = EmailInput.trim() !== "" && PasswordInput.trim() !== "";

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const LoginSubmit = async () => {
        try {
            const response = await api.post("/api/auth/staff/login/", {
                email: EmailInput,
                password: PasswordInput,
            });

            console.log("API Response:", response.data);

            const { access_token, refresh_token } = response.data;

            if (!access_token || !refresh_token) {
                console.error("Сервер не вернул токены!");
                return;
            }

            // Сохраняем токены в zustand store через auth
            auth({
                accessToken: access_token,
                refreshToken: refresh_token,
            });

            console.log("Токены успешно сохранены!");
        } catch (error) {
            console.error("Ошибка авторизации:", error);
        }
    };

    return (
        <section className={styles.container2}>
            <main className={styles.main2}>
                <div className={styles.boxlogo}>
                    <Image src="/logo.svg" alt="logo" width={150} height={57} />
                    <div className={styles.crm}>
                        <p>CRM</p>
                    </div>
                </div>
                <div className={styles.text2}>
                    <h3>Вход</h3>
                    <div className={styles.inputNumber}>
                        <Image src="/Letter.svg" alt='latter' className={styles.InputIcon} width={42} height={42}></Image>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={"Почта"}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputNumber}>
                        <Image
                            src="/Password.svg"
                            alt="password"
                            className={styles.InputIcon}
                            width={42}
                            height={42}
                        />
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder={"Пароль"}
                            value={PasswordInput}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Image
                            src={isPasswordVisible ? "/OpenEye.svg" : "/ClosedEye.svg"}
                            alt="eye"
                            className={`${styles.InputIcon2} ${isPasswordVisible ? styles.iconVisible : styles.iconHidden }`}
                            width={30}
                            height={30}
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    <div className={styles.arrow_btn} onClick={LoginSubmit}>
                        <button
                            id='btn_text'
                            className={isFormComplete ? styles.btn_next_active : styles.btn_next}>
                            <p>Далее</p>
                            <Image className={styles.btn_next_img} src="/Arrow Right.svg" width={24} height={24} alt="Next arrow" />
                        </button>
                    </div>
                </div>
            </main>
        </section>
    );
}