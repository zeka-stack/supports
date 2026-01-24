package dev.dong4j.zeka.stack.api.plugin.statistics.entity.dto;

import java.io.Serial;
import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> Token 排名数据传输实体 </p>
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.01.24
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Token 排名数据")
public class TokenRankingDTO implements Serializable {

    /** 序列化版本号 */
    @Serial
    private static final long serialVersionUID = 1L;

    /** GitHub 用户名 */
    @Schema(description = "GitHub 用户名")
    private String githubName;

    /** 设备 ID */
    @Schema(description = "设备 ID")
    private String deviceId;

    /** 总 token 数 */
    @Schema(description = "总 token 数")
    private Long tokenTotal;

    /** 排名 */
    @Schema(description = "排名")
    private Integer rank;
}
