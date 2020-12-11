<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="interface">
        <html>
            <body>
                <table border="2">
                    <tr bgcolor="yellow">
                        <th>Operation</th>
                        <th>Argument(s)</th>
                        <th>Return</th>
                    </tr>
                    <xsl:for-each select="abstract_method">
                        <tr>
                            <!-- Name of the abstract method -->
                            <td>
                                <xsl:value-of select="./@name" />
                            </td>
                            <!-- Parameter lists, formated as name:type -->
                            <td>
                                <xsl:for-each select="arguments">
                                    <xsl:for-each select="parameter">
                                        <xsl:value-of select="." />
                                        <xsl:text>:</xsl:text>                                       
                                        <xsl:value-of select="./@type" />
                                        <xsl:if test="following-sibling::parameter">                                            <!-- Add comma only if another parameter exists-->
                                            <xsl:text>,</xsl:text>
                                        </xsl:if>
                                    </xsl:for-each>
                                </xsl:for-each>
                            </td>
                            <!-- Return type of the abstract method -->
                            <td>
                                <xsl:value-of select="return" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>