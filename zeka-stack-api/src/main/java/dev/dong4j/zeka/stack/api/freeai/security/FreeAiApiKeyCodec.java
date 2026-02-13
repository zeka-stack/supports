package dev.dong4j.zeka.stack.api.freeai.security;

import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

import dev.dong4j.zeka.stack.api.plugin.feedback.security.SignatureVerifier;

/**
 * FreeAi API 密钥编解码器
 * <p> 提供用于生成和验证 FreeAi API 密钥的静态工具方法
 * <p> 该类实现了基于 HMAC-SHA256 签名算法的密钥生成与验证机制, 确保 API 密钥的完整性和真实性
 * <p> 生成的密钥格式为: 前缀 + Base64 编码的设备 ID 和过期时间 + Base64 编码的签名
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
public final class FreeAiApiKeyCodec {

    /** FreeAI API Key 前缀标识, 用于区分或识别特定格式的密钥 */
    private static final String PREFIX = "zsfa_";

    /**
     * 私有构造函数
     * <p> 防止实例化, 此类为工具类, 只提供静态方法
     */
    private FreeAiApiKeyCodec() {
    }

    /**
     * 生成 FreeAI API Key
     * <p> 使用主密钥, 设备 ID 和过期时间生成一个加密的 API Key. 生成的 Key 格式为: 前缀 + Base64 编码的负载 + "." + Base64 编码的签名.
     *
     * @param masterSecret     主密钥, 用于生成 HMAC-SHA256 签名
     * @param deviceId         设备 ID
     * @param expiresAtEpochMs 过期时间戳 (毫秒)
     * @return 生成的 API Key 字符串
     * @throws Exception 如果生成签名或编码过程中发生错误
     */
    public static String generate(String masterSecret, String deviceId, long expiresAtEpochMs) throws Exception {
        String payload = deviceId + ":" + expiresAtEpochMs;
        String payloadEncoded = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        byte[] signature = hmacSha256Bytes(masterSecret, payload);
        String signatureEncoded = Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        return PREFIX + payloadEncoded + "." + signatureEncoded;
    }

    /**
     * 验证 FreeAI API Key 的有效性
     * <p> 该方法解析并验证 API Key 的签名, 提取其中的设备 ID 和过期时间.
     * <p> 验证流程包括格式检查,Base64 解码,HMAC-SHA256 签名校验以及设备 ID 和过期时间的提取.
     *
     * @param masterSecret 主密钥, 用于生成期望的签名以校验 API Key
     * @param apiKey       待验证的 API Key 字符串
     * @return 验证结果对象 {@link VerificationResult}, 包含验证状态, 设备 ID 和过期时间戳.
     *     如果验证失败 (格式错误, 签名不匹配或参数无效), 返回无效结果.
     * @throws Exception 如果在解码或签名计算过程中发生错误
     */
    public static VerificationResult verify(String masterSecret, String apiKey) throws Exception {
        if (!StringUtils.hasText(masterSecret) || !StringUtils.hasText(apiKey) || !apiKey.startsWith(PREFIX)) {
            return VerificationResult.invalid();
        }

        String raw = apiKey.substring(PREFIX.length());
        int dotIndex = raw.indexOf('.');
        if (dotIndex <= 0 || dotIndex >= raw.length() - 1) {
            return VerificationResult.invalid();
        }

        String payloadEncoded = raw.substring(0, dotIndex);
        String signatureEncoded = raw.substring(dotIndex + 1);

        String payload = new String(Base64.getUrlDecoder().decode(payloadEncoded), StandardCharsets.UTF_8);
        byte[] providedSignature = Base64.getUrlDecoder().decode(signatureEncoded);
        byte[] expectedSignature = hmacSha256Bytes(masterSecret, payload);

        if (!MessageDigest.isEqual(expectedSignature, providedSignature)) {
            return VerificationResult.invalid();
        }

        int sepIndex = payload.lastIndexOf(':');
        if (sepIndex <= 0 || sepIndex >= payload.length() - 1) {
            return VerificationResult.invalid();
        }

        String deviceId = payload.substring(0, sepIndex);
        long expiresAt;
        try {
            expiresAt = Long.parseLong(payload.substring(sepIndex + 1));
        } catch (NumberFormatException e) {
            return VerificationResult.invalid();
        }

        if (!StringUtils.hasText(deviceId)) {
            return VerificationResult.invalid();
        }

        return VerificationResult.valid(deviceId, expiresAt);
    }

    /**
     * 计算 HMAC-SHA256 哈希值并返回字节数组
     * <p> 使用指定的密钥和消息生成 HMAC-SHA256 签名, 并以字节数组形式返回
     *
     * @param secret  密钥
     * @param message 消息内容
     * @return HMAC-SHA256 签名的字节数组
     * @throws Exception 如果计算哈希时发生错误
     */
    private static byte[] hmacSha256Bytes(String secret, String message) throws Exception {
        String b64 = SignatureVerifier.hmacBase64(secret, message);
        return Base64.getDecoder().decode(b64);
    }

    /**
     * FreeAI API Key 验证结果记录类
     * <p> 用于封装 API Key 验证过程中的结果信息, 包含验证状态, 设备 ID 以及过期时间戳
     * <p> 该类提供了创建无效和有效验证结果的静态工厂方法, 并包含判断结果是否过期的功能
     *
     * @param valid            验证状态,true 表示验证通过,false 表示验证失败
     * @param deviceId         设备 ID, 当验证失败时该值可能为 null
     * @param expiresAtEpochMs 过期时间戳 (毫秒级 Epoch 时间)
     * @author dong4j
     * @version 1.0.0
     * @email "mailto:dong4j@gmail.com"
     * @date 2026.02.13
     * @since 1.0.0
     */
    public record VerificationResult(boolean valid, String deviceId, long expiresAtEpochMs) {
        /**
         * 创建一个无效的验证结果
         * <p> 返回一个预设的无效状态实例, 表示验证未通过
         *
         * @return 无效的验证结果对象,valid 为 false,deviceId 为 null,expiresAtEpochMs 为 0
         */
        public static VerificationResult invalid() {
            return new VerificationResult(false, null, 0L);
        }

        /**
         * 创建一个验证成功的结果
         * <p> 此方法返回一个表示验证通过的 {@code VerificationResult} 实例
         *
         * @param deviceId         设备 ID
         * @param expiresAtEpochMs 过期时间戳 (毫秒)
         * @return 验证成功的结果对象
         */
        public static VerificationResult valid(String deviceId, long expiresAtEpochMs) {
            return new VerificationResult(true, deviceId, expiresAtEpochMs);
        }

        /**
         * 检查验证结果是否已过期
         * <p> 比较验证结果的过期时间戳与当前时间戳, 判断是否已过期
         *
         * @param nowEpochMs 当前时间的毫秒级时间戳 (Epoch 毫秒)
         * @return 如果已过期返回 {@code true}, 否则返回 {@code false}
         */
        public boolean isExpired(long nowEpochMs) {
            return expiresAtEpochMs <= nowEpochMs;
        }
    }
}
