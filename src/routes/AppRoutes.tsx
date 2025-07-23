@@ .. @@
       <Route path="/about" element={<AboutPage />} />
       <Route path="/radiacion" element={<SunPage />} />
       <Route path="/temperatura" element={<TemperaturePage />} />
-      <Route path="/Viento" element={<WindPage />} />
+      <Route path="/viento" element={<WindPage />} />
 
       {!isLoggedIn && <Route path="/login" element={<AdminLoginPage />} />}